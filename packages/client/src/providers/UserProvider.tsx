import React, { useMemo } from "react";
import { IUser, User } from "../core/user";
import { useObservableState } from "../hooks/use-observable-state";
import { userModule } from "../infra";
import { UserModule } from "../infra/user";

interface Props {}

interface IUserContext {
  user: IUser | null;
  userModule: UserModule;
}

const UserContext = React.createContext<IUserContext>(null!);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const user = useObservableState(userModule.state);

  return (
    <UserContext.Provider value={{ user, userModule }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);
