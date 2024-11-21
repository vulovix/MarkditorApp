mod fs_api;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub fn main() {
    let http = tauri_invoke_http::Invoke::new(["*"]);
    tauri::Builder::default()
      .plugin(tauri_plugin_fs::init())
      .plugin(tauri_plugin_shell::init())
      .plugin(tauri_plugin_cli::init())
      .plugin(tauri_plugin_dialog::init())
      // .invoke_system(http.initialization_script(), http.responder())
      .setup(move |app| {
        http.start(app.handle());
        Ok(())
      })
      .invoke_handler(tauri::generate_handler![greet])
      .invoke_handler(tauri::generate_handler![fs_api::rename_dir]) /* add event handlers here */
      .run(tauri::generate_context!())
      .expect("error while running tauri application")
}
