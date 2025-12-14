use tauri::{Manager, Window};
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "InitialMigration",
        sql: include_str!("./sql_migrations/v_1.sql"),
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:appdata.sqlite", migrations)
                .build(),
        )
        .plugin(tauri_plugin_http::init())
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
        .invoke_handler(tauri::generate_handler![init_main_window])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application!");
}

#[tauri::command]
fn init_main_window(window: Window) {
    match window.get_webview_window("splashscreen") {
        Some(found_window) => {
            found_window
                .hide()
                .expect("Could not hide splashscreen!");
        },
        None => {}
    }

    match window.get_webview_window("main") {
        Some(found_window) => {
            found_window
                .show()
                .expect("Could not show main window!");
        },
        None => {}
    }
}