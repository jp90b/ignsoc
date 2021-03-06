import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchFavouritedStatuses, expandFavouritedStatuses } from '../../actions/favourites';
import Column from '../ui/components/column';
import ColumnHeader from '../../components/column_header';
import StatusList from '../../components/status_list';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { debounce } from 'lodash';
import { meUsername } from 'gabsocial/initial_state';
import MissingIndicator from 'gabsocial/components/missing_indicator';

const mapStateToProps = (state, { params: { username } }) => {
  return {
    isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
    statusIds: state.getIn(['status_lists', 'favourites', 'items']),
    isLoading: state.getIn(['status_lists', 'favourites', 'isLoading'], true),
    hasMore: !!state.getIn(['status_lists', 'favourites', 'next']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Favourites extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    isMyAccount: PropTypes.bool.isRequired,
  };

  componentWillMount () {
    this.props.dispatch(fetchFavouritedStatuses());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandFavouritedStatuses());
  }, 300, { leading: true })

  render () {
    const { intl, statusIds, columnId, hasMore, isLoading, isMyAccount } = this.props;

    if (!isMyAccount) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.favourited_statuses' defaultMessage="You don't have any favourite gabs yet. When you favourite one, it will show up here." />;

    return (
      <Column>
        <StatusList
          statusIds={statusIds}
          scrollKey={`favourited_statuses-${columnId}`}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          emptyMessage={emptyMessage}
        />
      </Column>
    );
  }

}
