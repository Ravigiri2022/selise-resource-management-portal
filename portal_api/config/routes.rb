Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users do
        member do
          get :tasks
        end
      end
      resources :tasks do
        member do
          get :logs
        end
      end
      resources :projects do
        member do
          get :tasks
        end
      end
      resources :reschedule_logs
      resources :notifications
    end
  end
end
