# it is importante to use build the app using "ng b" before creating the image
# because the folder that will be dockerized is the output of the "ng b" commande
# and it located in the dost generated folder

# 1) Use official nginx image as the base image
FROM nginx:latest

# 2) Copy custom nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 3) Copy the build output to replace the default nginx contents.
#    the output folder can change depending on the version of Angular.
COPY ./dist/doctor/browser /usr/share/nginx/html

# 4) Expose port 80
EXPOSE 80