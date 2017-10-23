// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import {getAsyncInjectors} from 'utils/asyncInjectors';

const errorLoading = (err) => {
    console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
    cb(null, componentModule.default);
};

export default function createRoutes(store) {
    // Create reusable async injectors using getAsyncInjectors factory
    const {injectReducer, injectSagas} = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

    return [
        {
            path: '/',
            name: 'app',
            indexRoute: {
                onEnter: (nextState, replace) => replace('/home')
            }
        },
        {
            path: '/login',
            name: 'login',
            breadcrumbName: '登录',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import('containers/Login'),
                ]);
                const renderRoute = loadModule(cb);
                importModules.then(([component]) => {
                    renderRoute(component);
                });
                importModules.catch(errorLoading);
            },

        },

        {
            path: 'homeLayout',
            name: 'homeLayout',
            breadcrumbName: '首页',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import('containers/School/HomeLayout'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([component]) => {
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }

        },

        {
            path: 'news',
            name: 'news',
            breadcrumbName: '新闻页',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import('containers/School/News'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([component]) => {
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }
        },

        {
            path: 'address',
            name: 'address',
            breadcrumbName: '通讯录',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import('containers/School/Address'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([component]) => {
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }
        },

        {
            path: '',
            indexRoute: {
                onEnter: (nextState, replace) => replace('/home')
            },
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import('containers/MainLayoutPage'),
                ]);
                const renderRoute = loadModule(cb);
                importModules.then(([component]) => {
                    renderRoute(component);
                });
                importModules.catch(errorLoading);
            },
            childRoutes: [
                {
                    path: 'home',
                    name: 'home',
                    breadcrumbName: 'home',
                    getComponent(nextState, cb) {
                        const importModules = Promise.all([
                            import('containers/MainHomePage'),
                        ]);
                        const renderRoute = loadModule(cb);
                        importModules.then(([component]) => {
                            renderRoute(component);
                        });
                        importModules.catch(errorLoading);
                    },
                },
            
                {
                    path: 'imeOrder',
                    name: 'imeOrder',
                    breadcrumbName: 'imeOrder',
                    getComponent(nextState, cb) {
                        const importModules = Promise.all([
                            import('containers/ImePage/OrdersPage'),
                        ]);

                        const renderRoute = loadModule(cb);

                        importModules.then(([component]) => {
                            renderRoute(component);
                        });

                        importModules.catch(errorLoading);
                    }
                },



                {
                    path: '*',
                    name: 'notfound',
                    getComponent(nextState, cb) {
                        import('containers/NotFoundPage')
                            .then(loadModule(cb))
                            .catch(errorLoading);
                    }
                }
            ]
}


    ]
}
