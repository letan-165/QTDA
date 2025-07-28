package service

import (
	"QTDA/internal/user/dto"
)

type UserService interface {
	ViewProfile(id string) (dto.Student, error)
	EditProfile(request dto.Student) (dto.Student, error)
	SignUps(request dto.SignUpsRequest) ([]dto.User, error)
}
