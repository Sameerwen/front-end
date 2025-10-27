const { createApp } = Vue;

createApp({
  data() {
    return {
      lessons: [
        { id: 1, subject: 'Math', location: 'London', price: 100, spaces: 5, icon: 'math.png' },
        { id: 2, subject: 'English', location: 'Cambridge', price: 80, spaces: 10, icon: 'english.png' },
        { id: 3, subject: 'Science', location: 'Oxford', price: 90, spaces: 6, icon: 'science.png' },
        { id: 4, subject: 'Art', location: 'York', price: 95, spaces: 10, icon: 'art.png' },
        { id: 5, subject: 'Music', location: 'London', price: 85, spaces: 8, icon: 'music.png' },
        { id: 6, subject: 'Drama', location: 'York', price: 75, spaces: 7, icon: 'drama.png' },
        { id: 7, subject: 'Coding', location: 'Oxford', price: 110, spaces: 6, icon: 'coding.png' },
        { id: 8, subject: 'Dance', location: 'Cambridge', price: 70, spaces: 7, icon: 'dance.png' },
        { id: 9, subject: 'Chess', location: 'Oxford', price: 65, spaces: 6, icon: 'chess.png' },
        { id: 10, subject: 'Robotics', location: 'London', price: 120, spaces: 5, icon: 'robotics.png' }
      ],
      cart: [],
      showCart: false,
      sortKey: 'subject',
      ascending: true,
      searchQuery: '',
      name: '',
      phone: '',
      orderConfirmed: false
    };
  },
  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let modifier = this.ascending ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    },
    filteredLessons() {
      const query = this.searchQuery.toLowerCase();
      return this.sortedLessons.filter(lesson =>
        lesson.subject.toLowerCase().includes(query) ||
        lesson.location.toLowerCase().includes(query) ||
        lesson.price.toString().includes(query) ||
        lesson.spaces.toString().includes(query)
      );
    },
    validForm() {
      const nameRegex = /^[a-zA-Z\s]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return nameRegex.test(this.name) && phoneRegex.test(this.phone);
    }
  },
  methods: {
    toggleOrder() {
      this.ascending = !this.ascending;
    },
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces--;
        this.cart.push(lesson);
      }
    },
    removeFromCart(index) {
      const lesson = this.cart[index];
      lesson.spaces++;
      this.cart.splice(index, 1);
    },
    toggleCart() {
      this.showCart = !this.showCart;
    },
    checkout() {
      if (this.validForm && this.cart.length > 0) {
        this.cart = [];
        this.name = '';
        this.phone = '';
        this.orderConfirmed = true;
        setTimeout(() => this.orderConfirmed = false, 3000);
      }
    }
  }
}).mount('#app');
