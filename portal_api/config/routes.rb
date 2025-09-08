Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users
      resources :tasks
      resources :projects
      resources :reschedule_logs
    end
  end
end
