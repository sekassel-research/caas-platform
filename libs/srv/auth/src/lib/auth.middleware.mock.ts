export const AuthMiddlewareMock = (req, res, next) => {
  req.user = {
    name: 'test-user',
    roles: [''],
    resourceRoles: ['c', 'r', 'u', 'd']
  };
  next();
};
