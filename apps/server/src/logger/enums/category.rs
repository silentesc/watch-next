use std::fmt;

pub enum Category {
    Setup,
    Db,
    Worker,
    Tmdb,
    Middleware,
    Register,
    Login,
    Me,
}

impl fmt::Display for Category {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let category_str = match self {
            Category::Setup => String::from("setup"),
            Category::Db => String::from("db"),
            Category::Worker => String::from("worker"),
            Category::Tmdb => String::from("tmdb"),
            Category::Middleware => String::from("middleware"),
            Category::Register => String::from("register"),
            Category::Login => String::from("login"),
            Category::Me => String::from("me"),
        };
        write!(f, "{}", category_str)
    }
}
