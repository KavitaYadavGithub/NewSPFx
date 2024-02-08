import {sp} from '@pnp/sp/presets/all';
import { IListItems } from '../webparts/handlingLargeList/components/IListItems';
// import { IHandlingLargeListProps } from '../webparts/handlingLargeList/components/IHandlingLargeListProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';
// import { IList } from '@fluentui/react';
// import "@pnp/sp/lists";
import "@pnp/sp/items";

export class service{
    constructor(context:WebPartContext){
        sp.setup({
            spfxContext:context
        });
    }
    //Get maxID
    public getMaximumID():Promise<number>{
        let maxID:number;
        return new Promise<number>((resolve,reject)=>{
sp.web.lists.getByTitle('EmployeeData').items.orderBy('Id',false).top(1).select('Id').get()
.then((results:any)=>{
    if(results.length>0){
        maxID=results[0].Id,
        resolve(maxID);
    }
});
        })
    }

    //GetItems for each Iteration
    public getItemsForEachIteration(ListName:string,minid:number,maxId:number):Promise<IListItems[]>{
        var paginationResult:IListItems[]=[];
        const querView=
        `
        <view>
        <Query>
        <Where>
        <And>
        <Geq>
        <FieldRef Name='ID'/><Value Type='Number'>
        `
        +minid
        +
        `</Value>
        </Geq>
        <Leq>
        <FieldRef Name='ID'/><Value Type='Number'>
        `
        +maxId+
        `
        </Value></Leq>
        </And>
        <Eq>
        <FieldRef Name='line'/><Value Type='Text'>
Title</Value>    

</Eq>
</Where>
</Query>
</view>
`

return new Promise<IListItems[]>(async (resolve,reject)=>{
    sp.web.lists.getByTitle(ListName).getItemsByCAMLQuery({ViewXml:querView})
    .then((items:any)=>{
        items.map((item:any)=>{
            paginationResult.push({
                Title:item.Title
            });
            resolve(paginationResult);
        })
    })
})

    }
    //Get Items
public getMoreThan5000ItemswithoutUsingCAMLQuery(ListName:string):Promise<IListItems[]>{
    const result:IListItems[]=[];
    return new Promise<IListItems[]>(async (resolve,reject)=>{
        sp.web.lists.getByTitle(ListName).items.getAll().then((items:any)=>{
            items.map((item:any)=>{
                result.push({
                    Title:item.Title
                });
            });
        })
        resolve(result);
    })

}

//Get Items
public getMorethan5000itemsUsingCAMLQuery(ListName:string):Promise<IListItems[]>{
    const pageSize:number=5000;
    var FilteredResults:IListItems[]=[];
    return new Promise<IListItems[]>(async(resolve,reject)=>{
        this.getMaximumID().then((listmaxid:number)=>{
            for(var i=0;i<Math.ceil(listmaxid/pageSize);i++){
                var minId=i*pageSize+1;
                var maxId=i+1*pageSize;
                this.getItemsForEachIteration(ListName,minId,maxId).then((results)=>{
                    console.log(results.length);
                    results.map((result)=>{
                        FilteredResults.push({
                            Title:result.Title
                        });
                    });
                });
            }
            resolve(FilteredResults);
        });
    });
}
}

