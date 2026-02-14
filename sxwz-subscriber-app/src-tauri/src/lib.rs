mod bilibili_api;

use reqwest::{Client, ClientBuilder};
use std::time::Duration;
use tauri::{AppHandle, Manager, State};

use bilibili_api::login::{
    get_qrcode_status_base, get_qrcode_url_base, get_user_info_base, get_user_info_json_base,
    logout_base,
};

use crate::bilibili_api::models::{LoginStatusPostData, QRCodeData, UserInfoData};

#[tauri::command]
async fn get_qrcode_url(client: State<'_, Client>) -> Result<QRCodeData, String> {
    get_qrcode_url_base(&client, "https://passport.bilibili.com").await
}

#[tauri::command]
async fn get_user_info(
    app: AppHandle,
    client: State<'_, Client>,
    sess_data: String,
) -> Result<UserInfoData, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    get_user_info_base(&client, dir, "https://api.bilibili.com", sess_data).await
}

#[tauri::command]
fn get_user_info_json(app: AppHandle) -> Result<Option<UserInfoData>, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let data = get_user_info_json_base(dir).map_err(|e| e.to_string())?;
    Ok(data)
}

#[tauri::command]
fn logout(app: AppHandle) -> Result<(), String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    logout_base(dir)?;
    Ok(())
}

#[tauri::command]
async fn get_qrcode_status(
    client: State<'_, Client>,
    qrcode_key: String,
) -> Result<LoginStatusPostData, String> {
    get_qrcode_status_base(&client, "https://passport.bilibili.com", qrcode_key).await
}

#[tauri::command]
async fn fetch_image(url: String) -> Result<Vec<u8>, String> {
    let resp = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;
    Ok(resp.to_vec())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let bilibili_client = ClientBuilder::new()
        .timeout(Duration::from_secs(3))
        .build()
        .unwrap();

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
        .manage(bilibili_client)
        .invoke_handler(tauri::generate_handler![
            get_qrcode_url,
            get_user_info,
            get_user_info_json,
            get_qrcode_status,
            logout,
            fetch_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
