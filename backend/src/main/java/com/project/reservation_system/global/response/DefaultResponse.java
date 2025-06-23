package com.project.reservation_system.global.response;

import org.springframework.http.HttpStatus;

public class DefaultResponse {

    // ok (200)

    public static <T> ApiResponse displayFoundObject(T object) {
        return new ApiResponse<>(HttpStatus.OK, "Object(s) found", object);
    }

    public static <T> ApiResponse displayUpdatedObject(T object) {
        return new ApiResponse<>(HttpStatus.OK, "Object updated", object);
    }

    public static ApiResponse displayUpdateSuccess() {
        return new ApiResponse<>(HttpStatus.OK, "Update successful", null);
    }

    public static ApiResponse displayDeleteSuccess() {
        return new ApiResponse<>(HttpStatus.OK, "Delete successful", null);
    }

    public static ApiResponse displayAccessSuccess(String message) {
        return new ApiResponse<>(HttpStatus.OK, message, null);
    }

    // created (201)

    public static <T> ApiResponse displayCreatedObject(T object) {
        return new ApiResponse<>(HttpStatus.CREATED, "Object(s) created", object);
    }

    public static <T> ApiResponse displayCreatedObjectWithType(String type, T object) {
        return new ApiResponse<>(HttpStatus.CREATED, "Object type Line " + type + " created", object);
    }

    // no content (204)

    public static ApiResponse displayNoContent() {
        return new ApiResponse<>(HttpStatus.NO_CONTENT, "No object(s) found", null);
    }

    public static <T> ApiResponse displayNoContent(T object) {
        return new ApiResponse<>(HttpStatus.NO_CONTENT, "No object(s) found", object);
    }

    // unprocessable entity (422)

    public static ApiResponse displayNonexistentId(Long id) {
        return new ApiResponse<>(HttpStatus.UNPROCESSABLE_ENTITY, "Object with the ID " + id + " does not exist", null);
    }

    public static ApiResponse displayUnprocessable(String message) {
        return new ApiResponse<>(HttpStatus.UNPROCESSABLE_ENTITY, message, null);
    }

}
