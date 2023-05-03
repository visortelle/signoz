import { CheckCircleTwoTone, WarningOutlined } from '@ant-design/icons';
import { Menu, MenuProps, Space, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import getLocalStorageKey from 'api/browser/localstorage/get';
import { IS_SIDEBAR_COLLAPSED } from 'constants/app';
import ROUTES from 'constants/routes';
import history from 'lib/history';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { SideBarCollapse } from 'store/actions/app';
import { AppState } from 'store/reducers';
import AppReducer from 'types/reducer/app';

import { routeConfig, styles } from './config';
import { getQueryString } from './helper';
import menus, { MenuItem } from './menuItems';
import Slack from './Slack';
import {
	RedDot,
	Sider,
	SlackButton,
	SlackMenuItemContainer,
	Tags,
	VersionContainer,
} from './styles';

function SideNav(): JSX.Element {
	const dispatch = useDispatch();
	const [collapsed, setCollapsed] = useState<boolean>(
		getLocalStorageKey(IS_SIDEBAR_COLLAPSED) === 'true',
	);
	const { currentVersion, latestVersion, isCurrentVersionError } = useSelector<
		AppState,
		AppReducer
	>((state) => state.app);

	const { pathname, search } = useLocation();
	const { t } = useTranslation('');

	const onCollapse = useCallback(() => {
		setCollapsed((collapsed) => !collapsed);
	}, []);

	useLayoutEffect(() => {
		dispatch(SideBarCollapse(collapsed));
	}, [collapsed, dispatch]);

	const onClickHandler = useCallback(
		(to: string) => {
			const params = new URLSearchParams(search);
			const availableParams = routeConfig[to];

			const queryString = getQueryString(availableParams, params);

			if (pathname !== to) {
				history.push(`${to}?${queryString.join('&')}`);
			}
		},
		[pathname, search],
	);

	const onClickSlackHandler = (): void => {
		window.open('https://signoz.io/slack', '_blank');
	};

	const onClickVersionHandler = (): void => {
		history.push(ROUTES.VERSION);
	};

	const isNotCurrentVersion = currentVersion !== latestVersion;

	const sidebar: SidebarItem[] = [
		{
			onClick: onClickSlackHandler,
			icon: <Slack />,
			text: <SlackButton>Support</SlackButton>,
			key: 'slack',
		},
		{
			onClick: onClickVersionHandler,
			key: 'version',
			icon: isNotCurrentVersion ? (
				<WarningOutlined style={{ color: '#E87040' }} />
			) : (
				<CheckCircleTwoTone twoToneColor={['#D5F2BB', '#1f1f1f']} />
			),
			text: (
				<VersionContainer>
					{!isCurrentVersionError ? (
						<SlackButton>{currentVersion}</SlackButton>
					) : (
						<SlackButton>{t('n_a')}</SlackButton>
					)}
					{isNotCurrentVersion && <RedDot />}
				</VersionContainer>
			),
		},
	];

	const currentMenu = useMemo(
		() =>
			menus.find(
				(menu) =>
					menu.to === pathname ||
					menu.children?.find((child) => child.to === pathname),
			),
		[pathname],
	);

	const renderMenuItem = useCallback(
		({ to, Icon, name, tags, children }: MenuItem): ItemType => ({
			key: to,
			icon: <Icon />,
			onClick: (menuItem): void => onClickHandler(menuItem.key),
			label: (
				<Space>
					<div>{name}</div>
					{tags?.map((e) => (
						<Tags key={e}>
							<Typography.Text>{e}</Typography.Text>
						</Tags>
					))}
				</Space>
			),
			children: children?.map(renderMenuItem),
		}),
		[onClickHandler],
	);

	const items: MenuProps['items'] = menus.map(renderMenuItem);

	const sidebarItems = (props: SidebarItem, index: number): SidebarItem => ({
		key: `${index}`,
		icon: props.icon,
		onClick: props.onClick,
		label: props.text,
	});

	return (
		<Sider collapsible collapsed={collapsed} onCollapse={onCollapse} width={200}>
			<Menu
				theme="dark"
				defaultSelectedKeys={[ROUTES.APPLICATION]}
				selectedKeys={currentMenu ? [currentMenu?.to] : []}
				mode="vertical"
				style={styles}
				items={items}
			/>
			{sidebar.map((props, index) => (
				<SlackMenuItemContainer
					index={index + 1}
					key={`${index + 1}`}
					collapsed={collapsed}
				>
					<Menu
						theme="dark"
						defaultSelectedKeys={[ROUTES.APPLICATION]}
						selectedKeys={currentMenu ? [currentMenu?.to] : []}
						mode="inline"
						style={styles}
						items={[sidebarItems(props, index)]}
					/>
				</SlackMenuItemContainer>
			))}
		</Sider>
	);
}

interface SidebarItem {
	onClick: VoidFunction;
	icon?: React.ReactNode;
	text?: React.ReactNode;
	key: string;
	label?: React.ReactNode;
}

export default SideNav;
