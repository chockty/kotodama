Rails.application.routes.draw do
  devise_for :users,
  controllers: {
    omniauth_callbacks: "users/omniauth_callbacks",
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }
  resources :diaries, only:[:create, :show, :edit, :update]
  resources :memos, only:[:create, :show, :edit, :update]
  resources :users, only:[:show, :edit, :update] do
    resources :contents, only:[:index]
    post '/contents/search' => "contents#search"
  end
  root to: 'contents#top'
  post '/callback' => 'webhooks#callback'
  post '/users/:user_id/contents' => 'contents#index'
end
