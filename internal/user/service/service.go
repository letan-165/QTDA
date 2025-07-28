package service

import (
	"QTDA/internal/user/dto"
)

type UserService interface {
	ViewProfile(id string,role string) (any, error)
	SignUps(request dto.SignUpsRequest) ([]dto.User, error)
	Login(request dto.LoginRequest) (string, error)
}
