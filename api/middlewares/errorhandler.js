// Export a function named 'errorHandler' for creating custom error objects
const errorHandler = (statusCode, message) => {
	// Create a new Error instance with the provided error message
	const error = new Error(message);

	// Set the 'statusCode' property of the error object to the provided status code
	error.statusCode = statusCode;

	// Set the 'message' property of the error object to the provided message
	error.message = message;

	// Return the error object
	return error;
};
export default errorHandler;
