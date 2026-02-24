use tauri_plugin_http::reqwest;
use tauri_plugin_log::{Target, TargetKind};

use keyring::Entry;

const SERVICE: &str = "sxwz-subscriber-app";
const USER: &str = "bilibili";

#[tauri::command]
fn save_sess_data(sess_data: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE, USER).map_err(|e| e.to_string())?;
    entry.set_password(sess_data).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_sess_data() -> Result<Option<String>, String> {
    let entry = Entry::new(SERVICE, USER).map_err(|e| e.to_string())?;
    match entry.get_password() {
        Ok(v) => Ok(Some(v)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn delete_sess_data() -> Result<(), String> {
    let entry = Entry::new(SERVICE, USER).map_err(|e| e.to_string())?;
    match entry.delete_credential() {
        Ok(_) => Ok(()),
        Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
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
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            fetch_image,
            save_sess_data,
            get_sess_data,
            delete_sess_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
