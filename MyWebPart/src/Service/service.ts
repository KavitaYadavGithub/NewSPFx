import {Web} from '@pnp/sp/presets/all';
import "@pnp/sp/items";
import "@pnp/sp/lists";

export async function FetchData(siteurl:string):Promise<any[]>{
    const web=Web(siteurl);
    const items:any[]=await web.lists.getByTitle('SimpleForm').items();
    return items;
}

export async function createData(siteurl:string,formData:any):Promise<void>{
    const web=Web(siteurl);
    await web.lists.getByTitle('SimpleForm').items.add(formData);
}