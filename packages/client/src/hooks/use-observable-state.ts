// assume observable's source is a behavioral subject

import { useEffect, useRef, useState } from "react";
import { Observable } from "rxjs";

export const useObservableState = <T>(observable: Observable<T>) => {
  const initializedRef = useRef(false);

  const [state, setState] = useState((): T => {
    let initState: T;

    observable
      .subscribe((state) => {
        // console.log("[getting init state]");
        initState = state;
      })
      .unsubscribe();

    return initState!;
  });

  useEffect(() => {
    const subscription = observable.subscribe((state) => {
      // console.log("[new state]");

      // console.log(state);

      if (!initializedRef.current) {
        initializedRef.current = true;

        return;
      }

      setState(state);
    });

    return () => subscription.unsubscribe();
  }, [observable]);

  return state;
};
