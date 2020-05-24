function Downwind(app) {
  const { models } = app.data.sequelize;

  app.data.registerModel(__dirname, `ItinaryModel`);

  const api = {
    pathname: "/myItinary",
    middlewares: [
      app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/,
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async (context) => {
          const itinaries = await models.Itinary.findAll({
            where: {
              user_id: context.state.user.id,
            },
          });
          context.body = itinaries.map((itinary) => itinary.get());
          context.status = 200;
        },
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: async (context) => {
          const itinary = await models.Itinary.findOne({
            where: {
              user_id: context.state.user.id,
              id: context.params.id,
            },
          });

          if (!itinary) {
            context.status = 404;
            context.body = {
              error: {
                code: 404,
                name: "NotFound",
              },
            };
          } else {
            context.body = itinary.get();
            context.status = 200;
          }
        },
      },
      create: {
        pathname: "/",
        method: "post",
        handler: async (context) => {
          //TODO
          try {
            const downwind = await models.Itinary.create({
              ...context.request.body,
              user_id: context.state.user.id,
            });
            context.body = downwind.get();
            context.status = 200;
          } catch (error) {
            console.dir(error);
            throw error;
          }
        },
      },
      update: {
        pathname: "/:id",
        method: "patch",
        handler: async (context) => {
          const { id } = context.params;
          const user_id = context.state.user.id;
          await models.Itinary.update(context.request.body, {
            where: {
              id,
              user_id,
            },
          });
          const itinary = await models.Itinary.findOne({
            where: {
              id,
              user_id,
            },
          });
          context.body = itinary.get();
          context.status = 200;
        },
      },
      delete: {
        pathname: "/:id",
        method: "delete",
        handler: async (context) => {
          await models.Itinary.destroy({
            where: {
              id: context.params.id,
              user_id: context.state.user.id,
            },
          });
          context.status = 204;
        },
      },
    },
  };

  app.server.createRouter(api);
  return {};
}

module.exports = Downwind;
