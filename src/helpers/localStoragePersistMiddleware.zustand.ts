import { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStateActions } from './getStateActions';

/**
 * Функция-хелпер для синхронизации zustand-стора с localStorage
 *
 * @param {Function} f Store creator func
 * @param {string} localStorageKey local storage key
 * @returns {Object} persisted store
 */

export const localStoragePersistMiddleware = <State>(
    f: StateCreator<State>,
    localStorageKey: string,
): StateCreator<State, [], [['zustand/persist', unknown]]> =>
    persist(f, {
        name: localStorageKey,
        // кастомная функция, которая берет все данные из localStorage
        // а action из рантайма
        // дефолтный merge делает поверхностное сравнение из-за которого вылезает куча багов
        merge: (persistedState, currentState) =>
            ({
                ...getStateActions(currentState as Record<string, unknown>),
                ...(persistedState as State),
            }) as State,
    });
