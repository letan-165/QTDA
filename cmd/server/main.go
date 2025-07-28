package main

import (
	"QTDA/pkg/database"
	"QTDA/routers"

	"github.com/gin-gonic/gin"
)

func main() {
    database.ConnectDB()

    r := gin.Default()

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })

    routers.RegisterUserRouters(r)
    r.Run(":8080")
}
