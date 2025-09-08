class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :role, :jobTitle, :colorHex
end
