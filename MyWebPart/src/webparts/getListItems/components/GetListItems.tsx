import * as React from 'react';
import type { IGetListItemsProps } from './IGetListItemsProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Table, Input } from 'antd';
import { ColumnProps } from 'antd/lib/table';
interface IListItem {
  Title: string;
  Id: number;
  Person: {
    id: number;
    title: string;
  };
  Lookup: {
    id: number;
    title: string;
  };
}

interface IMyComponentState {
  listItems: IListItem[];
  loading: boolean;
  searchValue: string;
  currentPage: number;
}
export default class GetListItems extends React.Component<IGetListItemsProps, IMyComponentState> {

  private _tableColumns: ColumnProps<IListItem>[] = [
    {
      title: 'Title',
      dataIndex: 'Title',
      sorter: (a: IListItem, b: IListItem) => a.Title.localeCompare(b.Title)
    },
    {
      title: 'ID',
      dataIndex: 'Id',
      sorter: (a: IListItem, b: IListItem) => a.Id - b.Id
    },
    {title: 'Person',
      render: (item: IListItem) => item.Person.title,
    sorter: (a: IListItem, b: IListItem) => a.Person.title.localeCompare(b.Person.title)
    },
    {
      title: 'Lookup',
      render: (item: IListItem) => item.Lookup.title,
    sorter: (a: IListItem, b: IListItem) => a.Lookup.title.localeCompare(b.Lookup.title)
    }
  ];
  constructor(props:IGetListItemsProps){
    super(props);
    this.state={
      listItems: [],
      loading: true,
      searchValue: '',
      currentPage: 1
    };
  }
  public componentDidMount(): void {
    this._fetchListItems();
  }

  private _fetchListItems(): void {
    const siteUrl: string = this.props.context.pageContext.web.absoluteUrl;
    const endpoint: string = `${siteUrl}/_api/web/lists/getbytitle('ListItems')/items?$select=Title,Id,Person/Title,Lookup/Title&$expand=Person,Lookup`;

    this.props.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((jsonResponse: any) => {
        const listItems: IListItem[] = jsonResponse.value.map((item: any) => {
          return {
            Title: item.Title,
            Id: item.Id,
            Person: {
              title: item.Person.Title
            },
            Lookup: {
              title: item.Lookup.Title
            }
          };
        });

        this.setState({
          listItems,
          loading: false
        });
      });
  }
  private _handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue: string = event.target.value;
    this.setState({ searchValue, currentPage: 1 });
  };

  private _handlePaginationChange = (page: number): void => {
    this.setState({ currentPage: page });
  };
  public render(): React.ReactElement<IGetListItemsProps> {
    const { listItems, loading, searchValue, currentPage } = this.state;

    // Filter list items based on search value
    const filteredListItems: IListItem[] = listItems.filter((item: IListItem) =>
      item.Title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1);
      // includes(searchValue.toLowerCase));
      // Set up pagination
   const pageSize: number = 2;
   const startItemIndex: number = (currentPage - 1) * pageSize;
  const endItemIndex: number = startItemIndex + pageSize;
 const paginatedListItems: IListItem[] = filteredListItems.slice(startItemIndex, endItemIndex);


    return (
      <div>
    <Input.Search
      placeholder="Search by Title"
      value={searchValue}
      onChange={this._handleSearch}
      style={{ marginBottom: 16 }}
    />
    <Table
      dataSource={paginatedListItems}
      columns={this._tableColumns}
      loading={loading}
      pagination={{
        total: filteredListItems.length,
        pageSize,
        current: currentPage,
        onChange: this._handlePaginationChange
      }}
    />
    \
  </div>
      
    );
  }
}
