#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![feature(proc_macro_hygiene, decl_macro, once_cell)]

// #[macro_use] extern crate rocket;

use std::sync::OnceLock;

use rocket::{get, routes};
use tauri::{Manager, Window};

#[tauri::command]
fn on_button_click() {
  println!("Button clicked!");
}

static WINDOW: OnceLock<Window> = OnceLock::new();
fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      _ = WINDOW.set(window);

      #[get("/")]
      fn index() -> &'static str {
        WINDOW.get().expect("window is available").emit("from-rocket", format!("Hello, world!")).expect("emit works");
        "Hello, world!"
      }

      #[get("/putNumber/<key>/<num>")]
      fn put_number(key: String, num: f64) -> String {
        let window = WINDOW.get().expect("window is available");
        let ret_data = format!("{}:{}", key, num);
        window.emit("put-number", ret_data.clone()).expect("emit works");
        ret_data
      }

      #[get("/putBoolean/<key>/<value>")]
      fn put_boolean(key: String, value: bool) -> String {
        let window = WINDOW.get().expect("window is available");
        let ret_data = format!("{}:{}", key, value);
        window.emit("put-boolean", ret_data.clone()).expect("emit works");
        ret_data
      }

      #[get("/putString/<key>/<value>")]
      fn put_string(key: String, value: String) -> String {
        let window = WINDOW.get().expect("window is available");
        let ret_data = format!("{}:{}", key, value);
        window.emit("put-string", ret_data.clone()).expect("emit works");
        ret_data
      }

      tauri::async_runtime::spawn(async move {
        let _rocket = rocket::ignite()
          .mount("/", routes![index, put_number, put_boolean, put_string]).launch();
      });
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![on_button_click])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
