package routers

import (
	"QTDA/internal/user/handler"
	"QTDA/internal/user/service"

	"github.com/gin-gonic/gin"
)



func RegisterUserRouters(r *gin.Engine){
	userService := service.NewUserService()
	userHandler := handler.NewUserHandler(userService)

	r.GET("/user/profile/:userID/:role", userHandler.ViewProfileHandler)
	r.POST("/user/signups", userHandler.SignUpsHandler)
	r.POST("/user/login", userHandler.LoginHandler)
	r.POST("/user/introspect", userHandler.IntrospectHandler)



}