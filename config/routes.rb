Rails.application.routes.draw do
  devise_for :users,
  controllers: {
    omniauth_callbacks: "users/omniauth_callbacks",
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }
  resources :users, only:[:show, :edit, :update] do
    resources :contents, only:[:index]
    post '/contents/search' => "contents#search"
  end
  root to: 'contents#top'
  post '/callback' => 'webhooks#callback'
end
