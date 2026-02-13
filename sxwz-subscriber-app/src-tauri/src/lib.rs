use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
struct QRResp {
    data: QRData,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
struct QRData {
    qrcode_key: String,
    url: String,
}

#[derive(Debug, Deserialize)]
struct PollResp {
    code: i32,
    #[serde(default)]
    message: String,
    data: Option<PollData>,
}

#[derive(Debug, Deserialize)]
struct PollData {
    code: i32,
    #[serde(default)]
    message: String,
}

#[derive(Debug, Serialize)]
struct LoginResp {
    status: i32, // 86101: waiting, 86090: scanned, 86038: expired, 0: success
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    cookies: Option<String>,
}

#[tauri::command]
async fn check_login_status(qrcode_key: String) -> Result<LoginResp, String> {

  let api = format!(
    "https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key={}",
    qrcode_key
);
  let client = reqwest::Client::new();
    let resp = client.get(&api).send().await.map_err(|e| e.to_string())?;

    // 收集响应里下发的 set-cookie（通常成功后才有意义）
    let mut cookies_str = String::new();
    for cookie in resp.headers().get_all(SET_COOKIE) {
        if let Ok(c) = cookie.to_str() {
            cookies_str.push_str(c);
            cookies_str.push_str("; ");
        }
    }

    let body = resp.text().await.map_err(|e| e.to_string())?;
    let poll_resp: PollResp = serde_json::from_str(&body).map_err(|e| e.to_string())?;

    if poll_resp.code != 0 {
        return Err(poll_resp.message);
    }

    let data = poll_resp.data.ok_or_else(|| "No data in response".to_string())?;

    Ok(LoginResp {
        status: data.code,
        message: data.message,
        cookies: if data.code == 0 { Some(cookies_str) } else { None },
    })
}

#[tauri::command]
async fn get_login_qrdata() -> Result<QRData, String> {
    let api = "https://passport.bilibili.com/x/passport-login/web/qrcode/generate";
    let body = reqwest::get(api)
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;

    let qr_resp: QRResp = serde_json::from_str(&body).map_err(|e| e.to_string())?;
    Ok(qr_resp.data)
}

#[tauri::command]
async fn fetch_image(url: String) -> Result<Vec<u8>, String> {
    let resp = reqwest::get(url).await.map_err(|e| e.to_string())?;
    let status = resp.status();
    if !status.is_success() {
        return Err(format!("http {}", status));
    }
    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;
    Ok(bytes.to_vec())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
  .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      fetch_image,
      get_login_qrdata,
      check_login_status
      ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}