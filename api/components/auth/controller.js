class AuthController {
  /**
   * Handles login for a user
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   * @returns {Object} user and token
   */
  static login(req, res) {
    res.status(200).json({
      user,
      token,
    });
  }

  /**
   * Handles sign up of a user
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   * @returns {Object} user and token
   */
  static signup(req, res) {
    res.status(200).json({
      user,
      token,
    });
  }
}
