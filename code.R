#setting the working directory
setwd("C:/Users/PC/Desktop/Geoma Systems/IBL_2023/No2")

#getting the working directory
getwd()
dir()

#call the libraries
library(raster)
library(terra)
library(ggplot2)
library(rasterVis)
library(gplots)
library(reshape2)
library(sp)
library(sf)
library(exactextractr)

#importing data
Nyeri<-st_read("Nyeri.shp")
No2_2019<-raster("NO2_2019.tif")
No2_2020<-raster("NO2_2020.tif")
No2_2021<-raster("NO2_2021.tif")
No2_2022<-raster("NO2_2022.tif")

#stacking them together
NO2_stack<-stack(No2_2019,No2_2020,No2_2021, No2_2022)

#rename the layers
names(NO2_stack)<-c("N02_2019","N02_2020",
                    "N02_2021","N02_2022")


#visualize the tropospheric No2
gplot(NO2_stack )+
  geom_raster(aes(x=x, y=y,fill=value))+
  scale_fill_distiller(palette="YlOrRd",
                       direction = 1, 
                       name='Tropospheric_NO2',
                       na.value = "transparent")+
  facet_wrap(~variable, ncol = 2, nrow = 2)+
  coord_quickmap()+
  ggtitle('Nyeri County Tropospheric No2 ')+
  xlab("Longitude")+
  ylab("Latitude")+
  #theme_classic()+
  theme(text = element_text(size=7),
        axis.text.x = element_text(angle = 90, hjust = 1)) +
  theme(plot.title = element_text(hjust = 0.5))

#perfoming zonal statistics
zonals<-as.data.frame(cbind(Nyeri,
                                exact_extract(NO2_stack,Nyeri,
                                              c("mean"))))


#remove the unnecessary columns
No2_zonals<-subset(zonals, select=c(Name,mean.N02_2019,
                                    mean.N02_2020,mean.N02_2021,
                                    mean.N02_2022))
#export as csv
write.csv(No2_zonals,'zonals.csv')

#mean NO2 in long format
Mean_long<-melt(No2_zonals, id.vars = "Name",
                    variable.name = "Year", value.name ="Mean_No2" )

#formatting the columns
Mean_long$Year<- gsub("mean.N02_", "", Mean_long$Year)

#merging boundary with ndvi stats
Nyeri_stats<-merge(Nyeri, Mean_long,by="Name")
st_write(Nyeri_stats,"Nyeri.shp")
#plotting the mean N02
#plotting the mean ndvi
ggplot()+
  geom_sf(Nyeri_stats, 
          mapping=aes(fill=Mean_No2))+
  scale_fill_distiller(palette = "Reds",
                       direction = 1, name="Mean No2")+
  facet_wrap(~Year, ncol = 2, nrow = 2)+
  coord_sf()+
  ggtitle("Nyeri County Mean Tropospheric No2")+
  theme_gray()+
  xlab("Longitude")+
  ylab("Latitude")+
  theme(text = element_text(size=7)) +
  theme(plot.title = element_text(hjust = 0.5))+
  geom_sf_text(Nyeri_stats,mapping=aes(label=Name), size=2,
               hjust=0.4,color="black")

#boxplot
ggplot(Mean_long, aes(x = factor(Year), y = Mean_No2)) +
  geom_boxplot(fill="red") +
  ggtitle("Mean Troposperic No2") +
  xlab("Year") +
  ylab("No2")+
  theme(plot.title = element_text(hjust = 0.5))+
  theme(text = element_text(size=8))
