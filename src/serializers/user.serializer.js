export function toPublicUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
  
  export function toPublicUsers(users) {
    return users.map((user) => toPublicUser(user));
  }