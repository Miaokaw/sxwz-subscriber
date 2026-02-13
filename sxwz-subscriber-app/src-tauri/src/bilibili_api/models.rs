use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct QRCodeResp {
    pub code: i32,
    pub message: String,
    // pub ttl: i32,
    pub data: QRCodeData,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QRCodeData {
    pub url: String,
    pub qrcode_key: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginStatusResp {
    pub code: i32,
    pub message: String,
    // pub ttl: i32,
    pub data: LoginStatusData,
}

#[derive(Debug, Deserialize)]
pub struct LoginStatusData {
    pub url: String,
    // pub refresh_token: String,
    // pub timestamp: i64,
    pub code: i32,
    pub message: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct LoginStatusPostData {
    pub code: i32,
    pub sess_data: String,
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct UserInfoResp {
    pub code: i32,
    pub message: String,
    // pub ttl: i32,
    pub data: UserInfoData,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserInfoData {
    pub mid: u64,
    pub name: String,
    pub face: String,
}
