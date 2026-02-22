use std::path::PathBuf;

use crate::bilibili_api::models::{
    LoginStatusPostData, LoginStatusResp, QRCodeData, QRCodeResp, UserInfoData, UserInfoResp,
};

use reqwest::Client;
use url::Url;

use keyring::Entry;

const SERVICE: &str = "sxwz-subscriber-app";
const USER: &str = "bilibili";

fn save_sess_data_base(sess_data: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE, USER).map_err(|e| e.to_string())?;
    entry.set_password(sess_data).map_err(|e| e.to_string())
}

fn get_sess_data_base() -> Result<Option<String>, String> {
    let entry = Entry::new(SERVICE, USER).map_err(|e| e.to_string())?;
    match entry.get_password() {
        Ok(v) => Ok(Some(v)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

fn delete_sess_data_base() -> Result<(), String> {
    let entry = Entry::new(SERVICE, USER).map_err(|e| e.to_string())?;
    match entry.delete_credential() {
        Ok(_) => Ok(()),
        Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn get_qrcode_url_base(client: &Client, base: &str) -> Result<QRCodeData, String> {
    let api = format!("{}/x/passport-login/web/qrcode/generate", base);

    let resp = client
        .get(api)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<QRCodeResp>()
        .await
        .map_err(|e| e.to_string())?;

    if resp.code != 0 {
        return Err(resp.message);
    }

    Ok(resp.data)
}

fn write_user_info_json_base(dir: PathBuf, data: &UserInfoData) -> Result<(), String> {
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join("user_info.json");
    if path.exists() {
        std::fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    println!("Writing user info to: {:?}", path);
    let json = serde_json::to_string(data).map_err(|e| e.to_string())?;
    std::fs::write(&path, json).map_err(|e| e.to_string())
}

fn delete_user_info_json_base(dir: PathBuf) -> Result<(), String> {
    let path = dir.join("user_info.json");
    if path.exists() {
        std::fs::remove_file(&path).map_err(|e| e.to_string())
    } else {
        Ok(())
    }
}

pub fn get_user_info_json_base(dir: PathBuf) -> Result<Option<UserInfoData>, String> {
    let path = dir.join("user_info.json");
    if path.exists() {
        let json = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
        let data = serde_json::from_str(&json).map_err(|e| e.to_string())?;
        Ok(Some(data))
    } else {
        Ok(None)
    }
}

pub fn logout_base(dir: PathBuf) -> Result<(), String> {
    delete_sess_data_base()?;
    delete_user_info_json_base(dir)?;
    Ok(())
}

pub async fn get_user_info_base(
    client: &Client,
    dir: PathBuf,
    base: &str,
    sess_data: String,
) -> Result<UserInfoData, String> {
    let api = format!("{}/x/space/myinfo", base);

    let resp = client
        .get(api)
        .header("Cookie", "SESSDATA=".to_string() + &sess_data)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<UserInfoResp>()
        .await
        .map_err(|e| e.to_string())?;

    if resp.code != 0 {
        return Err(resp.message);
    }

    write_user_info_json_base(dir, &resp.data)?;

    Ok(resp.data)
}

pub async fn get_qrcode_status_base(
    client: &Client,
    base: &str,
    qrcode_key: String,
) -> Result<LoginStatusPostData, String> {
    let api = format!(
        "{}/x/passport-login/web/qrcode/poll?qrcode_key={}",
        base, qrcode_key
    );

    let resp = client
        .get(api)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<LoginStatusResp>()
        .await
        .map_err(|e| e.to_string())?;

    if resp.code != 0 {
        return Err(resp.message);
    }

    println!(
        "Login status response: code={}, message={}",
        resp.data.code, resp.data.message
    );

    let mut data: LoginStatusPostData = LoginStatusPostData {
        code: resp.data.code,
        sess_data: "".to_string(),
        message: resp.data.message.clone(),
    };

    if resp.data.code == 0 {
        let url = Url::parse(&resp.data.url).map_err(|e| e.to_string())?;

        let get = |key: &str| -> Option<String> {
            url.query_pairs()
                .find(|(k, _)| k == key)
                .map(|(_, v)| v.into_owned())
        };
        let sess_data = get("SESSDATA")
            .ok_or_else(|| format!("SESSDATA not found in URL: {}", resp.data.url))?;
        save_sess_data_base(&sess_data).map_err(|e| format!("Failed to save SESSDATA: {}", e))?;
        data.sess_data = sess_data;
        return Ok(data);
    }

    Ok(data)
}
