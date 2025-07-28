package repository

import (
	"QTDA/internal/user/dto"
	"QTDA/pkg/database"

	"github.com/google/uuid"
)

type UserRepositoryImpl struct{}



func NewUserRepository() UserRepository {
	return &UserRepositoryImpl{}
}

func (r *UserRepositoryImpl) FindByID(id string) (dto.Student, error) {
	var student dto.Student
	err := database.DB.
    Preload("User").
    Where("studentID = ?", id).
    First(&student).Error

	return student, err
}

func (r *UserRepositoryImpl) SaveUser(user dto.User) (dto.User, error) {
    if user.UserID == "" {
        user.UserID = uuid.New().String()
    }
    err := database.DB.Create(&user).Error
    return user, err
}

func (r *UserRepositoryImpl) SaveStudent(student dto.Student) (dto.Student, error) {
	err := database.DB.Create(&student).Error
	return student, err
}

func (r *UserRepositoryImpl) SaveEmployee(employee dto.Employee) (dto.Employee, error) {
	err := database.DB.Create(&employee).Error
	return employee, err
}

