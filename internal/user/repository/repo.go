package repository

import "QTDA/internal/user/dto"

type UserRepository interface {
	SaveUser(dto.User) (dto.User, error)
	SaveStudent(dto.Student) (dto.Student, error)
	SaveEmployee(dto.Employee) (dto.Employee, error)
	FindByID(id string) (dto.Student, error)
	FindByUsername(id string) (dto.User, error)
}
