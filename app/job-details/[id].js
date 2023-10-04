import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from "react-native-web"
import { Stack, useRouter, useSearchParams } from 'expo-router'
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";

import { useCallback, useState } from "react"
import useFetch from "../../hook/useFetch"
import { COLORS, SIZES, icons } from "../../constants"

const tabs = ["About", "Qualifications", "Responsibilities"]

const Jobdetails = () => {
  const params = useSearchParams()
  const router = useRouter()
  const [refreshing, isRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState(tabs[0])

  const { data, isLoading, error, refetch } = useFetch('job-details', {
    job_id: params.id
  })

  const onRefresh = useCallback(() => {
      isRefreshing(true);
      refetch();
      isRefreshing(false)
  })

  const displyTabContent = () => {
    switch (activeTab) {
      case "About":
        return <JobAbout
          info={data[0].job_description ?? "no data provided"}
        />
        break;
      case "Qualifications":
        return <Specifics 
        title= "Qualifications"
        points={data[0].job_highlights?.Qualifications ?? ["N/A"]}
      />
        break;
      case "Responsibilities":
        return <Specifics 
        title= "Responsibilities"
        points={data[0].job_highlights?.Responsibilities ?? ["N/A"]}
      />
        break;

    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
            />
          ),
          headerTitle: ''
        }
        }
      />
      <>
        <ScrollView
          showsVerticleScrollInicator={false} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

          {
            isLoading ? (
              <ActivityIndicator size='large' color={COLORS.primary} />
            ) : error ? (
              <View>
                someting went wrong here
              </View>
            ) : data.length === 0 ? (
              <Text>No data here</Text>
            ) : (
              <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                <Company
                  companyLogo={data[0].employer_logo}
                  jobTitle={data[0].job_title}
                  companyName={data[0].employer_name}
                  location={data[0].job_country}
                />
                <JobTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                { displyTabContent()}
              </View>

            )
          }

        </ScrollView>
        <JobFooter url={data[0]?.job_google_link ?? 'https>//careers.google.com/jobs/results'} />
      </>


    </SafeAreaView>
  )
}

export default Jobdetails