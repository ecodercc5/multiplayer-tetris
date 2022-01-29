export interface IUser {
  username: string;
  joined: Date;
  _id: string;
}

export namespace User {
  export const fromDTO = (userDTO: any): IUser => {
    const { username, joined, _id } = userDTO;
    const joinedDate = new Date(joined);

    return {
      username,
      joined: joinedDate,
      _id,
    };
  };
}
