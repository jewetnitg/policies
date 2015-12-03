```
const policyExecutor = PolicyExecutor({
  policies: {
    isLoggedIn(req) {
      return sesison.user ? Promise.resolve() : Promise.reject();
    }
  }
});

session.user = false;
policyExecutor.execute('isLoggedIn'); // rejects
session.user = true;
policyExecutor.execute('isLoggedIn'); // resolves
```

for a full specification of the {@link PolicyExecutor} class please refer to it's documentation.