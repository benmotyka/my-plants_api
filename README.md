<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/benmotyka/my-plants_api">
    <img src="readme/banner.png" alt="Banner">
  </a>
  <h1 align="center">My Plants</h1>
  <h5 align="center">Back-end App</h5>
  <p align="center">
    <a href="https://github.com/benmotyka/my-plants_api/issues">Report Bug</a>
    ·
    <a href="https://github.com/benmotyka/my-plants_api/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Server app for My Plants mobile app. 

Please refer to [https://github.com/benmotyka/my-plants_app](https://github.com/benmotyka/my-plants_app) to get more information about the project.

<br />

<p align="center">
  <!-- <a href="https://apps.apple.com">
    <img alt="app-store" src="readme/app-store.png" />
  </a> -->
  <a href="https://play.google.com/store/apps/details?id=com.benmotyka.myplants">
    <img alt="google-play" src="readme/google-play.png" />
  </a>
</p>

### Built With

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker compose](https://docs.docker.com/compose/install/)
- [AWS CLI account](https://aws.amazon.com/) (read/write access to S3)
- [AWS S3 Bucket](https://aws.amazon.com/s3/)

### Installation

1. Clone this repo
   ```sh
   git clone https://github.com/benmotyka/my-plants_api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create `.env` file and enter:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/db?schema=public 

   S3_BUCKET_NAME=<s3_bucket_name>
   S3_ACCESS_KEY=<aws_account_access_key>
   S3_SECRET_KEY=<aws_account_secret_key>
   ```
4. Run app
   ```sh
   docker-compose up --build
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
 -->

## Contact

Ben Motyka - [LinkedIn](https://www.linkedin.com/in/ben-motyka-97a729240/) - benmotykax@gmail.com

Project Link: [https://github.com/benmotyka/my-plants_api](https://github.com/benmotyka/my-plants_api)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [My Plants Mobile App](https://github.com/benmotyka/my-plants_app)
* [My Plants Website](https://github.com/benmotyka/my-plants_front)

<p align="right">(<a href="#readme-top">back to top</a>)</p>