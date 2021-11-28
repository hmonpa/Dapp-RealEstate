<template>
    <!-- ======= Header ======= -->
    <header id="header" class="fixed-top d-flex align-items-center">
        <div class="container d-flex align-items-center justify-content-between">

            <div class="logo">
                <h1><a href="/">Decentralized app</a></h1>
                <!-- Uncomment below if you prefer to use an image logo -->
                <!--<img src="/img/logo.png" alt="" class="img-fluid">-->
            </div>

            <nav id="navbar" class="navbar">
                <ul>
                <li><a class="nav-link scrollto" href="/#hero">Home</a></li>
                <li><a class="nav-link scrollto" href="/#properties">Properties</a></li>
                <li>
                    <NuxtLink v-if="userLogged" class="getstarted scrollto" to="publish">Publish a new property</NuxtLink>
                </li>
                <li>
                    <!-- Modal -->
                    <a 
                        v-if="userLogged"
                        class="access scrollto"
                        data-aos="fade-up" 
                        data-aos-delay="100"
                        data-bs-toggle="modal"
                        :data-bs-target="'#account_' + account"
                        style="cursor: pointer"
                    >
                        {{ userLogged }}
                    </a>
                    <!-- End Modal -->
                    <NuxtLink v-else class="access scrollto" to="access">Access</NuxtLink>
                </li>
                <li>
                    <a v-if="!account" class="metamask" style="cursor: pointer" @click="connectWallet"></a>
                    <a v-if="account && !userLogged" id="account">{{ account }}</a>
                </li>
                <li>
                    <a v-if="userLogged" class="nav-link scrollto" style="cursor: pointer" @click="logout">Logout</a>
                </li>
                </ul>
                <i class="bi bi-list mobile-nav-toggle"></i>
            </nav>
            <!-- .navbar -->

        </div>
        <!-- Modal -->
        <div
            :id="'account_' + account"
            :class="fade"
        >
            <div
                class=" modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 style="text-align:center">{{ account }}</h6>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            @click="pause"
                        ></button>
                    </div>
                    <div class="modal-body" style="padding: 40px;text-align:center">
                        <span class="line"></span>
                        <h6>User: {{ userLogged }}</h6>
                    </div>
                    <div class="modal-footer">
                    <button
                        type="button"
                        class="buy-tickets"
                        data-bs-dismiss="modal"
                        @click="pause()"
                    >
                        Close
                    </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- End Header -->
</template>

<script>
import Vue from 'vue';
import { Dapp } from '@/dapp';
import auth from '@/src/auth';
import swal from 'sweetalert';
import Swal from 'sweetalert2';


export default {
    computed: {
        userLogged() {
            return auth.getUserLogged();
        }
    },
    data() {
        const account = null;
        return {
            fade: "modal fade",
            autoplay: true,
            account
        }
    },
    async beforeMount(){
        // Checking every second if MetaMask have an account
        var accountInterval = setInterval(async() => {
            this.account = await Dapp.checkStatus();
        }, 1000);
    },
    methods: {
        async connectWallet() {
            this.account = await Dapp.loadEthereum();            
            if (!this.account)
            {
                Swal.fire({
                    title: "Vinculation fails!",
                    text: "Connect your MetaMask wallet or review your extension",
                    icon: "error"
                })
            } else {
                // Vue.prototype.$account = this.account;
                Swal.fire({
                    title: "Great!",
                    text: 'Your account ' + this.account + ' is already connected',
                    icon: 'success'
                });
            }
        },
        async logout() {
            Swal.fire({
                title: 'Are you sure you want to exit?',
                icon: 'warning',
                showDenyButton: true,
                confirmButtonText: 'Yes, I want to go out',
                denyButtonText: 'No, I want to stay'
            }).then((res) => {
                if(res.isConfirmed) {
                    let user = auth.getUserLogged();
                    auth.logoutUser(user);
                    window.location.reload();
                }
            });
        }
    }, 
    mounted() {
        /**
        * Easy selector helper function
        */
        const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
        }

        /**
        * Easy event listener function
        */
        const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
            selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
            selectEl.addEventListener(type, listener)
            }
        }
        }

        /**
        * Easy on scroll event listener 
        */
        const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
        }

        /**
        * Navbar links active state on scroll
        */
        let navbarlinks = select('#navbar .scrollto', true)
        const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            navbarlink.classList.add('active')
            } else {
            navbarlink.classList.remove('active')
            }
        })
        }
        window.addEventListener('load', navbarlinksActive)
        onscroll(document, navbarlinksActive)

        /**
        * Scrolls to an element with header offset
        */
        const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        if (!header.classList.contains('header-scrolled')) {
            offset -= 20
        }

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
        }

        /** * Toggle .header-scrolled class to #header when page is scrolled
        */
        let selectHeader = select('#header')
        if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
            selectHeader.classList.add('header-scrolled')
            } else {
            selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
        }

        /**
        * Back to top button
        */
        let backtotop = select('.back-to-top')
        if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
            backtotop.classList.add('active')
            } else {
            backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
        }

        /**
        * Mobile nav toggle
        */
        on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
        })

        /**
        * Mobile nav dropdowns activate
        */
        on('click', '.navbar .dropdown > a', function(e) {
        if (select('#navbar').classList.contains('navbar-mobile')) {
            e.preventDefault()
            this.nextElementSibling.classList.toggle('dropdown-active')
        }
        }, true)

        /**
        * Scrool with ofset on links with a class name .scrollto
        */
        on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
            navbar.classList.remove('navbar-mobile')
            let navbarToggle = select('.mobile-nav-toggle')
            navbarToggle.classList.toggle('bi-list')
            navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
        }, true)

        /**
        * Scroll with ofset on page load with hash links in the url
        */
        window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
            scrollto(window.location.hash)
            }
        }
        });
    }
}
</script>