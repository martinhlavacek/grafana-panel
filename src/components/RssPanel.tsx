import React, { PureComponent } from 'react';
import Feed from 'rss-to-json';
import { PanelProps, PanelData } from '@grafana/ui';
// import 'devextreme/dist/css/dx.common.css';
// import 'devextreme/dist/css/dx.light.css';
// import { RssFeedRow } from './RssFeedRow';

import PieChart, {
    Series,
    Label,
    Connector,
    Size,
    Export
  } from 'devextreme-react/pie-chart';

import { RssFeed, RssOptions } from '../types';

interface Props extends PanelProps<RssOptions> {}

interface State {
  rssFeed: RssFeed;
  isError: boolean;
}

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export class RssPanel extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.pointClickHandler = this.pointClickHandler.bind(this);
    this.legendClickHandler = this.legendClickHandler.bind(this);

    this.state = {
      rssFeed: {} as RssFeed,
      isError: false,
    };
  }

  componentDidMount(): void {
    this.loadFeed(this.props.options.feedUrl);
  }

  componentDidUpdate(prevProps: Props): void {
    if (this.props.options.feedUrl !== prevProps.options.feedUrl) {
      this.loadFeed(this.props.options.feedUrl);
    }
  }

  loadFeed(feedUrl: string) {
    Feed.load(CORS_PROXY + feedUrl, (error, feed) => {
      if (error) {
        console.error(error);
        this.setState({ isError: true });
        return;
      }

      this.setState({
        rssFeed: feed,
        isError: false,
      });
    });
  }

  createData(data: PanelData) {
    let result = [];  

      if (data.timeSeries) {
        data.timeSeries.map(time => {
            console.log('time', time);
            console.log('target', time.target);
            const country = time.target;
            const area = time.datapoints[0][0];
            console.log('count 0', time.datapoints[0]);
            console.log('count 00', time.datapoints[0][0]);
            result.push({
                country,
                area
            })
        })
      }
      
      return result;
  }

  render() {
    // const { isError, rssFeed } = this.state;
    const { panelData } = this.props;
    console.log('panelData', panelData);
    const { isError } = this.state;
    const source = this.createData(panelData);
    console.log('source', source);
    // const areas = [{
    //     country: 'Russia',
    //     area: 12
    //   }, {
    //     country: 'Canada',
    //     area: 7
    //   }, {
    //     country: 'USA',
    //     area: 7
    //   }, {
    //     country: 'China',
    //     area: 7
    //   }, {
    //     country: 'Brazil',
    //     area: 6
    //   }, {
    //     country: 'Australia',
    //     area: 5
    //   }, {
    //     country: 'India',
    //     area: 2
    //   }, {
    //     country: 'Others',
    //     area: 55
    //   }];

    return (
        <PieChart
          id={'pie'}
          dataSource={source}
          palette={'Bright'}
          title={'Area of Countries'}
          onPointClick={this.pointClickHandler}
          onLegendClick={this.legendClickHandler}
        >
          <Series
            argumentField={'country'}
            valueField={'area'}
          >
            <Label visible={true}>
              <Connector visible={true} width={1} />
            </Label>
          </Series>
  
          <Size width={500} />
          <Export enabled={true} />
        </PieChart>
      );

    // if (rssFeed.items && rssFeed.items.length > 1) {
    //   return (
    //     <div
    //       style={{
    //         padding: '24px 0',
    //         maxHeight: '100%',
    //         overflow: 'scroll',
    //       }}
    //     >
    //       {rssFeed.items.map((item, index) => {
    //         return <RssFeedRow key={`${item.created}-${index}`} item={item} />;
    //       })}
    //     </div>
    //   );
    // }



    if (isError) {
      return <div>Error :(</div>;
    }

    return <div>Loading...</div>;
  }


  pointClickHandler(e) {
    this.toggleVisibility(e.target);
  }

  legendClickHandler(e) {
    let arg = e.target;
    let item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  toggleVisibility(item) {
    item.isVisible() ? item.hide() : item.show();
  }

}
