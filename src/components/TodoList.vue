<template>
  <div class="box">
    <div class="columns">
        <div class="column">{{  today }}</div>
        <div class="column">{{ dayWeek  }}</div>
    </div>
    <b-field>
        <input
            type="text"
            class="input is-success"
            placeholder="Add new task"
            @keyup.enter="addTask" 
        />
    </b-field><br/>
    <div v-for="task in todoListsFiltered" :key="task._id">
        <div class="columns">
            <div class="column">
                <span
                    v-if="!task.editing"
                    :class="{ completed: task.completed }"
                    @dblclick="editTask(task)"
                >
                    {{ task.title }}
                </span>
                <input
                    v-else
                    type="text"
                    class="input is-success"
                    :value="task.title"
                    :ref="'inputEditTask-' + task._id"
                    @keyup.enter="onEditTask(task._id, $event)"
                    @blur="onEditTask(task._id, $event)"
                    @keyup.esc="cancelEdit(task)"
                />
            </div>
            <div class="column">
                <b-checkbox
                    v-model="task.completed"
                    type="is-success"
                >
                </b-checkbox>
                <b-button
                    type="is-danger"
                    size="is-small"
                    @click="removeTask(task._id)"
                >
                    X
                </b-button>
            </div>
        </div>
    </div>
    <hr/>
    <div v-show="filterBy === 'all'">
        <div class="columns">
            <div class="column">
                <p style="font-size: 18px;">
                    <b-checkbox
                        type="is-success"
                        v-model="checkedAllTaskCompleted"
                        @input="markAllTasksCompleted"
                    >
                        Mark all completed / <i>{{ totalTaskToDo }} tasks to do</i>
                    </b-checkbox>
                </p>
            </div>
            <div class="column">
                <b-button
                    type="is-info is-light"
                    v-if="hasTasksCompleted"
                    @click="clearAllTasksCompleted"
                    style="margin-top: -10px;"
                >
                    Clear all completed
                </b-button>
            </div>
        </div>
        <hr/>
    </div>
    <p style="font-size: 18px;">
        Filter by
    </p>
    <div class="buttons has-addons">
        <button
            class="button"
            :class="{'is-success is-light': filterBy === 'all'}"
            @click="onFilterBy('all')"
        >
            All
        </button>
        <button
            class="button"
            :class="{'is-success is-light': filterBy === 'completed'}"
            @click="onFilterBy('completed')"
        >
            Completed
        </button>
        <button
            class="button"
            :class="{'is-success is-light': filterBy === 'not_completed'}"
            @click="onFilterBy('not_completed')"
        >
            Not completed
        </button>
    </div>
  </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'TodoList',
        data: function(){
            return {
                today: moment().format('MMMM Do YYYY'),
                dayWeek: moment().format('dddd'),
                checkedAllTaskCompleted: false,
                filterBy: "all",
                todoLists: [{
                    _id: 1,
                    title: "My firts task",
                    completed: false,
                    editing: false
                }]
            }
        },
        watch: {
            todoLists: {
                deep: true,
                handler: function(newValue){
                    if (!newValue.length){
                        this.checkedAllTaskCompleted = false;
                        return;
                    }
                    this.checkedAllTaskCompleted = this.totalTaskToDo === 0;
                }
            }
        },
        methods: {
            addTask: function(e){
                var task = e.target.value;
                if (task.trim().length === 0){
                    return;
                }
                this.todoLists.push({
                    _id: this.lastId,
                    title: task,
                    completed: false,
                    editing: false
                });
                e.target.value = "";
            },
            editTask: function(task){
                task.editing = true;
                this.$nextTick(() => {
                    this.$refs["inputEditTask-" + task._id][0].focus();
                });
            },
            onEditTask: function(taskId, e){
                var task = e.target.value;
                if (task.trim().length === 0){
                    return;
                }
                this.todoLists = this.todoLists.map(function(todo){
                    if (todo._id === taskId){
                        todo.title = task;
                        todo.editing = false;
                        return todo;
                    }
                    return todo;
                });
            },
            cancelEdit: function(task){
                task.editing = false;
            },
            removeTask: function(taskId){
                this.todoLists = this.todoLists.filter((task) => {
                    return task._id !== taskId;
                });
            },
            markAllTasksCompleted: function(checked){
                this.todoLists.forEach((task) => {
                    task.completed = checked;
                });
            },
            clearAllTasksCompleted: function(){
                this.todoLists = this.todoLists.filter((task) => {
                    return !task.completed;
                });
            },
            onFilterBy: function(filter){
                this.filterBy = filter;
            }
        },
        computed: {
            lastId: function(){
                if (!this.todoLists.length){
                    return 1;
                }
                return this.todoLists[this.todoLists.length - 1]._id + 1;
            },
            totalTaskToDo: function(){
                if (!this.todoLists.length){
                    return 0;
                }
                return this.todoLists.filter((task) => {
                    return !task.completed;
                }).length;
            },
            totalTaskCompleted: function(){
                if (!this.todoLists.length){
                    return 0;
                }
                return this.todoLists.filter((task) => {
                    return task.completed;
                }).length;
            },
            hasTasksCompleted: function(){
                return totalTaskCompleted > 0;
            },
            todoListsFiltered: function(){
                if (this.filterBy === "all"){
                    return this.todoLists;
                }
                if (this.filterBy === "completed"){
                    return this.todoLists.filter((task) => {
                        return task.completed;
                    });
                }
                if (this.filterBy === "not_completed"){
                    return this.todoLists.filter((task) => {
                        return !task.completed;
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .completed {
        text-decoration: line-through;
        color: grey;
    }
</style>
