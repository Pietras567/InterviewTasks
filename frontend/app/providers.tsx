'use client';
import {Provider} from 'react-redux';
import {ReactNode} from 'react';
import {store} from '@/stores/messageStore';

type Props = { children: ReactNode };

export function Providers({children}: Props) {
    return <Provider store={store}>{children}</Provider>;
}
