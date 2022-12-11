#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![feature(proc_macro_hygiene, decl_macro, once_cell)]


use std::sync::OnceLock;
// #[macro_use] extern crate rocket;
use rocket::{get, routes};
use tauri::{Window, Manager, Wry};

#[tauri::command]
fn on_button_click() {
  println!("Button clicked!");
}

static WINDOW: OnceLock<Window> = OnceLock::new();
fn main() {
  tauri::Builder::default()
    .setup(move |app| {
      let window: Window<Wry> = app.get_window("main").unwrap();

      _ = WINDOW.set(window).expect("Failed to set window");

      #[get("/")]
      fn index() -> &'static str {
        // WINDOW.get().expect("window is available").emit("from-rocket", format!("Hello, world!")).expect("emit works");
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
    .invoke_handler(tauri::generate_handler![on_button_click, report_time_elapsed])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn report_time_elapsed(window: Window<Wry>) {
  tauri::async_runtime::spawn(async move {
    let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(250));
    let start_time = std::time::Instant::now();

    loop {
      interval.tick().await;

      // emit an awesome event to the main window
      window.emit("time_elapsed", start_time.elapsed());
    }
  });
}

