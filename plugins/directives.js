import Vue from 'vue';

Vue.directive('click-outside', {
    inserted: (el, binding) => {
        el.clickOutsideEvent = event => {
            if (!(el == event.target || el.contains(event.target))) {
                binding.value();
            }
        };
        document.addEventListener('click', el.clickOutsideEvent);
    },
    unbind: el => {
        document.removeEventListener('click', el.clickOutsideEvent);
    },
});
