---
nav_order: 5
---

# Developing a Client App

If building the server can be that easier, how about developing the client app?

As we have seen in previous article, the server has been designed that you'll stick with `BaseModel` and use it thorough the system. This has a great benefit that the implementation would be consistent across client pages too! 

In CRM Toolkit, we have designed a client web from ground up, powered with Parcel.js as the bundler and React.js as the framework. We also integrates React Router DOM for URL routing Material-UI for the base UI framework and React Table for developing a complex table, among many other tools.

## Installing

Using the install script, it runs `npm install` on the web directory.

The installed `node_modules` contains about 80 MB or almost 15000 files so it might take a while for first installation. The number may huge but it's reasonably small compared to typical project that runs `create-react-app` (their project runs 150 MB in node_modules!)



## Next

+ Read [Deploying to The Internet](deploy.md)
+ Back to the [Main Page](index.md)