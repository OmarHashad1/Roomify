export const create = async ({ model, data, options = {} }) => {
  try {
    const isArray = Array.isArray(data);
    const payload = await model.create(isArray ? data : [data], options);
    return {
      data: isArray ? payload : payload[0],
    };
  } catch (err) {
    throw err;
  }
};

export const findOne = async ({ model, filter, select = {}, options = {} }) => {
  const query = await model.findOne(filter).select(select);
  if (options.lean) query.lean();
  if (options.populate) query.populate();

  const doc = await query;
  return doc;
};


export const findByEmail = async ({
  model,
  email,
  select = "",
  options = {},
}) => {
  const doc = await findOne({
    model: model,
    filter: { email },
    select,
    options,
  });

  return doc;
};
