use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};

pub fn generate_secure_256() -> Result<String, getrandom::Error> {
    let mut bytes = [0u8; 32];
    getrandom::fill(&mut bytes)?;
    Ok(URL_SAFE_NO_PAD.encode(bytes))
}
