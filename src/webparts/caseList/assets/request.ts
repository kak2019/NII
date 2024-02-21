import { spfi } from '@pnp/sp';
import { getSP } from '../../../common/pnpjsConfig';

const REQUESTSCONST = { LIST_NAME: 'Nii Cases'};

const fetchById = async (arg: {
  Id: number;
}): Promise<Record<string, unknown> | string> => {
  const sp = spfi(getSP());
  const item = await sp.web.lists
    .getByTitle(REQUESTSCONST.LIST_NAME)
    .items.getById(arg.Id)()
    .catch((e) => e.message);
  return item;
};

const editRequest = async (arg: {
  request: Record<string, unknown>;
}): Promise<Record<string, unknown> | string> => {
  const { request } = arg;
  const sp = spfi(getSP());
  const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
  await list.items
    .getById(+request.ID)
    .update(request)
    .catch((err) => err.message);
  const result = await fetchById({ Id: +request.ID });
  return result;
};

const addRequest  = async (arg: {
  request: Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<Record<string, unknown> | string> => {
  const { request } = arg;
  const sp = spfi(getSP());
  const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
  
  const result = await list.items.add(request).catch((err) => err.message);

  // const requestNew = result.data as Record<string, unknown>;
  // const titleStr = 'TAXI Request - ' + ('' + requestNew.ID).slice(-6);
  // const result2 = await editRequest({
  //   request: {
  //     ID: requestNew.ID,
  //     Title: titleStr,
  //   },
  // });

  return result;
};
const fetchSupplierNameByParma = async (arg: {
    ParmaNum: string;
  }): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const result = await sp.web.lists
        .getByTitle(REQUESTSCONST.LIST_NAME)
        .renderListDataAsStream({
          ViewXml: `<View>
                              <Query>
                                  <Where>
                                      <Eq>
                                          <FieldRef Name="PARMANo"/>
                                          <Value Type="Text">${arg.ParmaNum}</Value>
                                      </Eq>
                                  </Where>
                              </Query>
                              <ViewFields>
                              <FieldRef Name="PARMANo"/>
                              <FieldRef Name="CompanyName"/>
                              </ViewFields>
                              <RowLimit>5</RowLimit>
                          </View>`,
        })
        .then((response) => {
          if (response.Row.length > 0) {
            return response.Row[0].CompanyName;
          } else {
            return "";
          }
        });
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject("Error when fetch Supplier Name");
    }
  };
export { addRequest, editRequest, fetchById,fetchSupplierNameByParma };


