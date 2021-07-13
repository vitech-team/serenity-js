import { Duration, Task } from '@serenity-js/core';
import { Enter, Key, Press, Wait } from '@serenity-js/webdriverio';
import { TodoList } from './ui';

export class RecordItem {
    static called = (name: string) =>
        Task.where(`#actor adds an item called "${ name }"`,
            Enter.theValue(name).into(TodoList.newTodoInput),
            Press.the(Key.Enter).in(TodoList.newTodoInput),
        )
}
