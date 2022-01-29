import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IUser, User } from "../core/user";
import { socket } from "../web-socket";

interface Props {}

interface IUserActions {
  createUser(username: string): void;
  deleteUser(): void;
}

interface IUserContext {
  user: IUser | null;
  actions: IUserActions;
}

const UserContext = React.createContext<IUserContext>(null!);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const onUserCreated = (userDTO: any) => {
      console.log("[user created]");

      console.log(userDTO);

      const user = User.fromDTO(userDTO);

      console.log(user);

      setUser(user);
    };

    socket.on("user:created", onUserCreated);

    return () => {
      socket.off("user:created", onUserCreated);
    };
  }, []);

  const createUser = (username: string) => {
    console.log("[creating user]");

    socket.emit("user:create", { username });
  };

  const deleteUser = useCallback(() => {
    console.log(user);

    if (!user) {
      return;
    }

    console.log("[deleting user]");

    socket.emit("user:delete", user.username);
  }, [user]);

  const actions = useMemo(() => ({ createUser, deleteUser }), [deleteUser]);

  return (
    <UserContext.Provider value={{ user, actions }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);
