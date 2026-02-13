use crate::bilibili_api::models::{
    LoginStatusPostData, LoginStatusResp, QRCodeData, QRCodeResp, UserInfoData, UserInfoResp,
};

use reqwest::Client;
use sp_keyring::Sr25519Keyring;
use url::Url;

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

pub async fn get_user_info_base(
    client: &Client,
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
        let sess_data = get("SESSDATA").expect("NO SESSDATA");
        data.sess_data = sess_data;
        return Ok(data);
    }

    Ok(data)
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockito::Server;
    use reqwest::{header::CONTENT_TYPE, ClientBuilder};
    use std::time::Duration;

    #[tokio::test]
    async fn test_get_login_qrcode_base() {
        let mut server = Server::new_async().await;
        let client = ClientBuilder::new()
            .timeout(Duration::from_secs(3))
            .build()
            .expect("should build client");

        let _m = server
            .mock("GET", "/x/passport-login/web/qrcode/generate")
            .with_status(200)
            .with_header(CONTENT_TYPE, "application/json")
            .with_body(
                r#"{"code": 0,"message":"OK","ttl":1,"data":{"url":"https://account.bilibili.com\u0026","qrcode_key":"37db98b9fe42c91c49b4516b3784befb"}}"#,
            )
            .create_async()
            .await;

        let url = get_qrcode_url_base(&client, &server.url())
            .await
            .expect("should succeed");

        assert_eq!(url, "https://account.bilibili.com&");
    }

    #[tokio::test]
    async fn test_get_qrcode_status_base() {
        let mut server = Server::new_async().await;
        let client = ClientBuilder::new()
            .timeout(Duration::from_secs(3))
            .build()
            .expect("should build client");

        let _m = server
            .mock("GET", "/x/passport-login/web/qrcode/poll?qrcode_key=1e329e27fe6914475efd382ffb8d0f78")
            .with_status(200)
            .with_header(CONTENT_TYPE, "application/json")
            .with_body(
                r#"{"code":0,"message":"OK","ttl":1,"data":{"url":"https://passport.biligame.com/x/passport-login/web/crossDomain?DedeUserID=289082664\u0026DedeUserID__ckMd5=da3251e55e0d5c86\u0026Expires=1786533895\u0026SESSDATA=88f233c2,1786533895,a3c44*21CjCMhLP0GSDVT-tN318CYSSRJ1PftAFX9osOSLrcDAL4QWlL6IXlq4l6DHrNmvPev7gSVmFmNExIMUJpQWx4UFRKX2Nsd1hGS2pjVjRTX1lCUjl3R3J0Unl2Z1Z1aUl6MkJjZG9ubmlmTmhXeFQ5ZzNTSUVybGZlSXBob1prQ2hvTjVzbmJFMUNBIIEC\u0026bili_jct=7662fb5a1ec65374ca30947b13866317\u0026gourl=https%3A%2F%2Fwww.bilibili.com\u0026first_domain=.bilibili.com","refresh_token":"f17216dcd47b3cf0c98ed351659b1721","timestamp":1770981895163,"code":0,"message":""}}"#,
            )
            .create_async()
            .await;

        let data = get_qrcode_status_base(
            &client,
            &server.url(),
            "1e329e27fe6914475efd382ffb8d0f78".to_string(),
        )
        .await
        .expect("should succeed");

        let expect_data: LoginStatusPostData = LoginStatusPostData {
            code: 0,
            sess_data: "88f233c2,1786533895,a3c44*21CjCMhLP0GSDVT-tN318CYSSRJ1PftAFX9osOSLrcDAL4QWlL6IXlq4l6DHrNmvPev7gSVmFmNExIMUJpQWx4UFRKX2Nsd1hGS2pjVjRTX1lCUjl3R3J0Unl2Z1Z1aUl6MkJjZG9ubmlmTmhXeFQ5ZzNTSUVybGZlSXBob1prQ2hvTjVzbmJFMUNBIIEC".to_string(),
            message: "".to_string(),
        };

        assert_eq!(data.code, expect_data.code);
        assert_eq!(data.sess_data, expect_data.sess_data);
        assert_eq!(data.message, expect_data.message);
    }
}
